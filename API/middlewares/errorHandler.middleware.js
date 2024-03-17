const errorHandler = (error, req, res, next) => {
    const appStage = process.env.APP_STAGE

    if (error instanceof Error) {
        // console.log("error handler=<", error)
        return res.status(500).json({
            isSuccess: false,
            isError: true,
            message: appStage === "DEV" ? error.message : "internal server error"
        })
    }

    res.status(error?.statusCode).json({
        isSuccess: false,
        isError: true,
        message: error.message ? error.message : "internal server error"
    })

}

module.exports = errorHandler