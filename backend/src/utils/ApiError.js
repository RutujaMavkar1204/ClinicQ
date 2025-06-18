class ApiError extends Error{
    constructor(message="something went wrong",errors=[],statusCode,stack=""){
        super(message),
        this.message=message,
        this.errors=errors,
        this.statusCode=statusCode,
        this.stack=stack,
        this.success=false

        if(stack){
            this.stack=stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }


    }

}
export default ApiError