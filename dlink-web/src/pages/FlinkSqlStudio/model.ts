import type {Effect, Reducer} from "umi";
import {
   handleAddOrUpdate
} from "@/components/Common/crud";
import type {SqlMetaData} from "@/components/Studio/StudioEvent/data";

export type ClusterType = {
  id: number,
  name: string,
  alias: string,
  type: string,
  hosts: string,
  jobManagerHost: string,
  status: number,
  note: string,
  enabled: boolean,
  createTime: Date,
  updateTime: Date,
}

export type ClusterConfigurationType = {
  id: number,
  name: string,
  alias: string,
  type: string,
  config: any,
  available: boolean,
  note: string,
  enabled: boolean,
  createTime: Date,
  updateTime: Date,
}

export type DataBaseType = {
  id: number,
  name: string,
  alias: string,
  groupName: string,
  type: string,
  url: string,
  username: string,
  password: string,
  note: string,
  dbVersion: string,
  status: boolean,
  healthTime: Date,
  heartbeatTime: Date,
  enabled: boolean,
  createTime: Date,
  updateTime: Date,
};

export type EnvType = {
  id?: number,
  name?: string,
  alias?: string,
  fragment?: boolean,
};

export type TaskType = {
  id?: number,
  catalogueId?: number,
  name?: string,
  alias?: string,
  dialect?: string,
  type?: string,
  checkPoint?: number,
  savePointStrategy?: number,
  savePointPath?: string,
  parallelism?: number,
  fragment?: boolean,
  statementSet?: boolean,
  config?: [],
  clusterId?: any,
  clusterName?: string,
  clusterConfigurationId?: number,
  clusterConfigurationName?: string,
  databaseId?: number,
  databaseName?: string,
  jarId?: number,
  envId?: number,
  note?: string,
  enabled?: boolean,
  createTime?: Date,
  updateTime?: Date,
  statement?: string,
  session: string;
  maxRowNum: number;
  jobName: string;
  useResult: boolean;
  useChangeLog: boolean;
  useAutoCancel: boolean;
  useSession: boolean;
  useRemote: boolean;
};

export type ConsoleType = {
  result: {};
  chart: {};
}

export type TabsItemType = {
  title: string;
  key: number,
  value: string;
  closable: boolean;
  path: string[];
  task?: TaskType;
  console: ConsoleType;
  monaco?: any;
  isModified: boolean;
  sqlMetaData?: SqlMetaData;
}

export type TabsType = {
  activeKey: number;
  panes?: TabsItemType[];
}

export type ConnectorType = {
  tablename: string;
}

export type SessionType = {
  session?: string;
  sessionConfig?: {
    type?: string;
    useRemote?: boolean;
    clusterId?: number;
    clusterName?: string;
    address?: string;
  }
  createUser?: string;
  createTime?: string;
  connectors: ConnectorType[];
}

export type StateType = {
  isFullScreen: boolean;
  toolHeight?: number;
  toolRightWidth?: number;
  toolLeftWidth?: number;
  cluster?: ClusterType[];
  sessionCluster?: ClusterType[];
  clusterConfiguration?: ClusterConfigurationType[];
  database?: DataBaseType[];
  env?: EnvType[];
  currentSession?: SessionType;
  current?: TabsItemType;
  sql?: string;
  // monaco?: any;
  currentPath?: string[];
  tabs?: TabsType;
  session?: SessionType[];
  result?: {};
  rightClickMenu?: boolean;
  refs?: {
    history: any;
  };
};

export type ModelType = {
  namespace: string;
  state: StateType;
  effects: {
    saveTask: Effect;
  };
  reducers: {
    changeFullScreen: Reducer<StateType>;
    saveToolHeight: Reducer<StateType>;
    saveToolRightWidth: Reducer<StateType>;
    saveToolLeftWidth: Reducer<StateType>;
    saveSql: Reducer<StateType>;
    saveCurrentPath: Reducer<StateType>;
    // saveMonaco: Reducer<StateType>;
    saveSqlMetaData: Reducer<StateType>;
    saveTabs: Reducer<StateType>;
    closeTabs: Reducer<StateType>;
    changeActiveKey: Reducer<StateType>;
    saveTaskData: Reducer<StateType>;
    saveSession: Reducer<StateType>;
    showRightClickMenu: Reducer<StateType>;
    refreshCurrentSession: Reducer<StateType>;
    quitCurrentSession: Reducer<StateType>;
    saveResult: Reducer<StateType>;
    saveCluster: Reducer<StateType>;
    saveSessionCluster: Reducer<StateType>;
    saveClusterConfiguration: Reducer<StateType>;
    saveDataBase: Reducer<StateType>;
    saveEnv: Reducer<StateType>;
    saveChart: Reducer<StateType>;
  };
};

const Model: ModelType = {
  namespace: 'Studio',
  state: {
    isFullScreen: false,
    toolHeight: 400,
    toolRightWidth: 300,
    toolLeftWidth: 300,
    cluster: [],
    sessionCluster: [],
    clusterConfiguration: [],
    database: [],
    env: [],
    currentSession: {
      connectors: [],
    },
    current: undefined,
    sql: '',
    // monaco: {},
    currentPath: ['引导页'],
    tabs: {
      activeKey: 0,
      panes: [],
    },
    session: [],
    result:{},
    rightClickMenu: false,
    refs:{
      history:{},
    }
  },

  effects: {
    * saveTask({payload}, {call, put}) {
      const para = payload;
      para.configJson = JSON.stringify(payload.config);
      yield call(handleAddOrUpdate, 'api/task', para);
      yield put({
        type: 'saveTaskData',
        payload,
      });
    },
  },

  reducers: {
    changeFullScreen(state, {payload}) {
      return {
        ...state,
        isFullScreen: payload,
      };
    },
    saveToolHeight(state, {payload}) {
      return {
        ...state,
        toolHeight: payload,
      };
    },saveToolRightWidth(state, {payload}) {
      return {
        ...state,
        toolRightWidth: payload,
      };
    },saveToolLeftWidth(state, {payload}) {
      return {
        ...state,
        toolLeftWidth: payload,
      };
    },
    saveSql(state, {payload}) {
      const newTabs = state.tabs;
      const newCurrent = state.current;
      newCurrent.value = payload;
      for (let i = 0; i < newTabs.panes.length; i++) {
        if (newTabs.panes[i].key == newTabs.activeKey) {
          newTabs.panes[i].value = payload;
          newTabs.panes[i].task && (newTabs.panes[i].task.statement = payload);
        }
      }
      return {
        ...state,
        current: {...newCurrent},
        tabs:{...newTabs},
      };
    },
    saveCurrentPath(state, {payload}) {
      return {
        ...state,
        currentPath: payload,
      };
    },
    /*saveMonaco(state, {payload}) {
      return {
        ...state,
        monaco:payload,
      };
    },*/
    saveSqlMetaData(state, {payload}) {
      const newCurrent = state.current;
      const newTabs = state.tabs;
      if(newCurrent.key == payload.activeKey){
        newCurrent.sqlMetaData = {...payload.sqlMetaData};
        newCurrent.isModified = payload.isModified;
      }
      for (let i = 0; i < newTabs.panes.length; i++) {
        if (newTabs.panes[i].key == payload.activeKey) {
          newTabs.panes[i].sqlMetaData = {...payload.sqlMetaData};
          newTabs.panes[i].isModified = payload.isModified;
          break;
        }
      }
      return {
        ...state,
        current: {...newCurrent},
        tabs: {...newTabs},
      };
    },
    saveTabs(state, {payload}) {
      let newCurrent = state.current;
      for (let i = 0; i < payload.panes.length; i++) {
        if (payload.panes[i].key == payload.activeKey) {
          newCurrent = payload.panes[i];
        }
      }
      if(payload.panes.length == 0){
        return {
          ...state,
          current: undefined,
          tabs: payload,
          currentPath: ['引导页'],
        };
      }
      return {
        ...state,
        current: {
          ...newCurrent,
          isModified:false,
        },
        tabs: {...payload},
        currentPath: newCurrent.path,
      };
    },
    deleteTabByKey(state, {payload}) {
      const newTabs = state.tabs;
      for (let i = 0; i < newTabs.panes.length; i++) {
        if (newTabs.panes[i].key == payload) {
          newTabs.panes.splice(i, 1);
          break;
        }
      }
      const newCurrent = undefined;
      if(newTabs.panes.length > 0){
        newCurrent = newTabs.panes[newTabs.panes.length - 1];
      }
      if (newTabs.activeKey == payload) {
        newTabs.activeKey = newCurrent.key;
      }
      return {
        ...state,
        current: {...newCurrent},
        tabs: {...newTabs},
      };
    },
    closeTabs(state, {payload}) {
      const {deleteType, current} = payload;
      const newTabs = state.tabs;
      const firstKey = newTabs.panes[0].key;
      const newCurrent = newTabs.panes[0];
      if (deleteType == 'CLOSE_OTHER') {
        const keys = [firstKey, current.key];
        newCurrent = current;
        newTabs.activeKey = current.key;
        newTabs.panes = newTabs.panes.filter(item => keys.includes(item.key));
      } else {
        newTabs.panes = [];
        newTabs.activeKey = firstKey
      }

      return {
        ...state,
        current: {...newCurrent},
        tabs: {...newTabs}
      };
    },
    changeActiveKey(state, {payload}) {
      const newTabs = state?.tabs;
      let newCurrent = state?.current;
      for (let i = 0; i < newTabs.panes.length; i++) {
        if (newTabs.panes[i].key == payload) {
          newTabs.activeKey = payload;
          newCurrent = newTabs.panes[i];
        }
      }
      return {
        ...state,
        current: {...newCurrent},
        tabs: {...newTabs},
        currentPath: newCurrent.path,
      };
    },
    saveTaskData(state, {payload}) {
      const newTabs = state.tabs;
      const newCurrent = state.current;
      for (let i = 0; i < newTabs.panes.length; i++) {
        if (newTabs.panes[i].key == payload.key) {
          newTabs.panes[i].task = payload;
          newTabs.panes[i].isModified = false;
          if(newCurrent.key == payload.key){
            newCurrent = newTabs.panes[i];
          }
        }
      }
      return {
        ...state,
        current: {...newCurrent},
        tabs: {...newTabs},
      };
    },
    saveSession(state, {payload}) {
      return {
        ...state,
        session: [...payload],
      };
    },
    showRightClickMenu(state, {payload}) {
      return {
        ...state,
        rightClickMenu: payload,
      };
    },
    refreshCurrentSession(state, {payload}) {
      return {
        ...state,
        currentSession: {
          ...state?.currentSession,
          ...payload
        }
      };
    },
    quitCurrentSession(state) {
      return {
        ...state,
        currentSession: {
          connectors: [],
        }
      };
    },
    saveResult(state, {payload}) {
      const newTabs = state?.tabs;
      const newCurrent = state?.current;
      for (let i = 0; i < newTabs.panes.length; i++) {
        if (newTabs.panes[i].key == payload.key) {
          newTabs.panes[i].console.result.result = payload.datas;
          if(newCurrent.key == payload.key){
            newCurrent.console = newTabs.panes[i].console;
          }
          break;
        }
      }
      return {
        ...state,
        current: {...newCurrent},
        tabs: {...newTabs},
      };
    },
    saveCluster(state, {payload}) {
      return {
        ...state,
        cluster: [...payload],
      };
    },saveSessionCluster(state, {payload}) {
      return {
        ...state,
        sessionCluster: [...payload],
      };
    },saveClusterConfiguration(state, {payload}) {
      return {
        ...state,
        clusterConfiguration: [...payload],
      };
    },saveDataBase(state, {payload}) {
      return {
        ...state,
        database: [...payload],
      };
    },saveEnv(state, {payload}) {
      return {
        ...state,
        env: [...payload],
      };
    },saveChart(state, {payload}) {
      let newTabs = state?.tabs;
      let newCurrent = state?.current;
      for (let i = 0; i < newTabs.panes.length; i++) {
        if (newTabs.panes[i].key == newTabs.activeKey) {
          newTabs.panes[i].console.chart = payload;
          newCurrent = newTabs.panes[i];
          break;
        }
      }
      return {
        ...state,
        current: {...newCurrent},
        tabs: {...newTabs},
      };
    },
  },
};

export default Model;
