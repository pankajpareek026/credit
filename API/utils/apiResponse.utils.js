class ApiResponse {
    constructor(isSuccess = true, isError, message = "Success", data = "") {
        this.isSuccess = isSuccess
        this.isError = isError
        this.responseData = data
        this.message = message

    }
}

module.exports = ApiResponse