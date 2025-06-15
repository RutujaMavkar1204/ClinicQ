class ApiResponse{
    constructor(data, message='success', statusCode){
        this.data=data,
        this.message=message,
        this.statusCode=statusCode,
        this.succes=statusCode<400
    }
}
export default ApiResponse