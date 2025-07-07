export interface ESNode {
    name: string;
    host?: string;
    id?: string;
}

export interface RawESTask {
    action: string;
    parent_task_id?: string;
    type: string;
    description?: string;
    running_time_in_nanos?: number;
    start_time_in_millis?: number;
}

export interface Task {
    nodeName: string;
    nodeHost: string;
    nodeId: string;
    taskId: string;
    parentTaskId?: string;
    action?: string;
    type?: string;
    description?: string;
    running_time?: number;
    start_time?: number;
}

export interface IndexData {
    [key: string]: string | number | boolean | null;
}

export interface NodeData {
    [key: string]: string | number | boolean | null;
}

export interface ShardData {
    index: string;
    shard: number | string;
    node: string;
    [key: string]: any;
}
