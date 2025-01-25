import React from 'react';
import { Provider } from 'react-redux';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { store } from '../store';
import ActionLogPanel from '../components/ActionLogPanel';
import ToDos from '../components/ToDos';
import AddTodo from '../components/AddTodo';
import SearchTodo from '../components/SearchTodo';


const PanelGroupLayout = () => {
  return (
    <Provider store={store}>
      <PanelGroup direction="horizontal">
        {/* Item Collection Panel */}
        <Panel defaultSize={30} minSize={20}>
          <div className="h-full bg-white relative">
            <div className="h-full pt-8 p-4">
              <SearchTodo />
              <ToDos />
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-slate-200 hover:bg-slate-400 transition-colors" />

        {/* Create New Item Panel */}
        <Panel>
          <div className="h-full bg-white relative">
            <div className="h-full pt-8 p-4">
              <AddTodo />
            </div>
          </div>
        </Panel>

        <PanelResizeHandle className="w-1 bg-slate-200 hover:bg-slate-400 transition-colors" />

        {/* Action History Panel */}
        <Panel defaultSize={30} minSize={20}>
          <div className="h-full bg-white relative">
            <div className="h-full pt-8 p-4">
              <ActionLogPanel />
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </Provider>
  );
};

export default PanelGroupLayout;
