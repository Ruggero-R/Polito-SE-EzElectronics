const EXISTING_REVIEW = "You have already reviewed this product"
const NO_REVIEW = "You have not reviewed this product"
const INVALID_REVIEWS_PARAMETERS = "Invalid parameters"
const PRODUCT_NOT_FOUND = "Product not found"

class ExistingReviewError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = EXISTING_REVIEW
        this.customCode = 409
    }
}

class NoReviewProductError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = NO_REVIEW
        this.customCode = 404
    }
}

//aggiunti di seguito
class InvalidParametersError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = INVALID_REVIEWS_PARAMETERS
        this.customCode = 422
    }
}

class ProductNotFoundError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = PRODUCT_NOT_FOUND
        this.customCode = 404
    }
}

export { ExistingReviewError, NoReviewProductError, ProductNotFoundError, InvalidParametersError }