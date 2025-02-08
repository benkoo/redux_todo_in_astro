import { createSlice, createSelector } from '@reduxjs/toolkit';

// Simple hash generation function
const generateHash = () => `content_${Math.random().toString(36).substr(2, 9)}`;

// Utility function to create content with relationships
const createContentCard = (content, relationships = {}) => ({
  hash: generateHash(),
  content,
  createdAt: new Date().toISOString(),
  metadata: {},
  relationships: {
    parentHash: null,
    childHashes: [],
    relatedHashes: [],
    ...relationships
  }
});

const initialState = {
  cards: {},
  selectedHash: null,
  search: {
    query: '',
    results: [],
    filters: {}
  }
};

export const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    // Add new content with flexible relationships
    addContent: {
      reducer: (state, action) => {
        const { hash, content, relationships } = action.payload;
        state.cards[hash] = createContentCard(content, relationships);
        
        // Update parent and related content relationships
        if (relationships?.parentHash) {
          const parentContent = state.cards[relationships.parentHash];
          if (parentContent) {
            parentContent.relationships.childHashes.push(hash);
          }
        }
      },
      prepare: (content, relationships = {}) => ({
        payload: {
          hash: generateHash(),
          content,
          relationships
        }
      })
    },

    // Delete content and clean up relationships
    deleteContent: (state, action) => {
      const contentHash = action.payload;
      const contentToDelete = state.cards[contentHash];

      if (contentToDelete) {
        // Remove child references
        contentToDelete.relationships.childHashes.forEach(childHash => {
          delete state.cards[childHash];
        });

        // Clean up parent relationships
        if (contentToDelete.relationships.parentHash) {
          const parentContent = state.cards[contentToDelete.relationships.parentHash];
          if (parentContent) {
            parentContent.relationships.childHashes = 
              parentContent.relationships.childHashes.filter(hash => hash !== contentHash);
          }
        }

        // Remove the content itself
        delete state.cards[contentHash];
      }

      // Reset selection if deleted content was selected
      if (state.selectedHash === contentHash) {
        state.selectedHash = null;
      }
    },

    // Select a specific content item
    selectContent: (state, action) => {
      state.selectedHash = action.payload;
    },

    // Update search functionality
    setSearchQuery: (state, action) => {
      const query = action.payload.toLowerCase();
      state.search.query = query;

      // Advanced search across content
      state.search.results = Object.values(state.cards)
        .filter(card => 
          card.content.toLowerCase().includes(query) || 
          JSON.stringify(card.metadata).toLowerCase().includes(query)
        )
        .map(card => card.hash);
    },

    // Update content metadata
    updateContentMetadata: (state, action) => {
      const { hash, metadata } = action.payload;
      if (state.cards[hash]) {
        state.cards[hash].metadata = {
          ...state.cards[hash].metadata,
          ...metadata
        };
      }
    },

    // Update content relationships
    updateContentRelationships: (state, action) => {
      const { hash, relationships } = action.payload;
      if (state.cards[hash]) {
        state.cards[hash].relationships = {
          ...state.cards[hash].relationships,
          ...relationships
        };
      }
    }
  }
});

// Memoized selectors for efficient state retrieval
export const selectContentState = createSelector(
  state => state.content,
  content => ({
    cards: content.cards,
    selectedCard: content.selectedHash ? content.cards[content.selectedHash] : null,
    searchResults: content.search.results.map(hash => content.cards[hash])
  })
);

export const { 
  addContent, 
  deleteContent, 
  selectContent, 
  setSearchQuery,
  updateContentMetadata,
  updateContentRelationships
} = contentSlice.actions;

export default contentSlice.reducer;
