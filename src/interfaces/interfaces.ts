export interface ITask{
    taskName:string,
    assignedTo:string,
    assignedBy?:string,
    date:Date|string,
    status:string,
    description:string,
    priority:string,
}
export interface ApiErrorResponse{
    message:string
}