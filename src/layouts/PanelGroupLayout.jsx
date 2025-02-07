import React from 'react';
import { Provider, useSelector } from 'react-redux';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { store } from '../store';
import ActionLogPanel from '../components/panels/ActionLogPanelReact';
import SearchAndTodos from '../components/panels/SearchAndTodos';
import ItemDetailPanel from '../components/panels/ItemDetailPanel';
import SearchANDPrompts from '../components/panels/SearchANDPrompts';
import GeneratePanel from '../components/panels/GeneratePanel';
import { PANEL_TYPES } from '../features/panellayoutSlice';

const PanelContent = () => {
  const mode = useSelector(state => state.panellayout.mode);
  const panels = useSelector(state => state.panellayout.panels);

  const renderPanel = (type) => {
    const panel = panelConfig[type];
    if (panel) {
      const Component = panel.component;
      return <Component />;
    }
    return null;
  };

  return (
    <div className="h-screen overflow-hidden">
      <PanelGroup direction="horizontal" className="h-full">
        {/* Left Panel */}
        <Panel defaultSize={panels.left.size} minSize={panels.left.minSize}>
          <div className="h-full overflow-hidden">
            {renderPanel(panels.left.type)}
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-slate-200 hover:bg-slate-400 transition-colors" />

        {/* Middle Panel */}
        <Panel defaultSize={panels.middle.size} minSize={panels.middle.minSize}>
          <div className="h-full overflow-hidden">
            <GeneratePanel />
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-slate-200 hover:bg-slate-400 transition-colors" />

        {/* Right Panel */}
        <Panel defaultSize={panels.right.size} minSize={panels.right.minSize}>
          <div className="h-full overflow-hidden">
            {renderPanel(panels.right.type)}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

const PanelGroupLayout = () => {
  return (
    <Provider store={store}>
      <PanelContent />
    </Provider>
  );
};

export default PanelGroupLayout;
