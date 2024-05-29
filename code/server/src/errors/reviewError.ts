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

class ProductNotFoundError extends Error {
    customMessage: string
    customCode: number

    constructor() {
        super()
        this.customMessage = PRODUCT_NOT_FOUND
        this.customCode = 404
    }
}

export { ExistingReviewError, NoReviewProductError, ProductNotFoundError }