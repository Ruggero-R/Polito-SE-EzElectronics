import { InvalidParametersError } from "../errors/reviewError";
import { User } from "../components/user";
import ReviewDAO from "../dao/reviewDAO";

class ReviewController {
    private dao: ReviewDAO

    constructor() {
        this.dao = new ReviewDAO
    }

    /**
     * Adds a new review for a product
     * @param model The model of the product to review
     * @param user The username of the user who made the review
     * @param score The score assigned to the product, in the range [1, 5]
     * @param comment The comment made by the user
     * @returns A Promise that resolves to nothing
     */
    async addReview(model: string, user: User, score: number, comment: string) /**:Promise<void> */ {
        if ((!model || typeof model !== 'string' || !model.trim()) || !(user instanceof User) || (typeof score !== 'number' || score < 1 || score > 5) || (typeof comment !== 'string' || !comment || !comment.trim()))
            throw new InvalidParametersError;
        const ret: any = await this.dao.addReview(model, user, score, comment);
        return ret
    }

    /**
     * Returns all reviews for a product
     * @param model The model of the product to get reviews from
     * @returns A Promise that resolves to an array of ProductReview objects
     */
    async getProductReviews(model: string) /**:Promise<ProductReview[]> */ {
        if (!model || !model.trim() || typeof model !== 'string')
            throw new InvalidParametersError;
        const ret: any = await this.dao.getProductReviews(model);
        return ret
    }

    /**
     * Deletes the review made by a user for a product
     * @param model The model of the product to delete the review from
     * @param user The user who made the review to delete
     * @returns A Promise that resolves to nothing
     */
    async deleteReview(model: string, user: User) /**:Promise<void> */ {
        if (!model || !model.trim() || typeof model !== 'string' || !(user instanceof User)) {
            throw new InvalidParametersError
        }
        const ret: any = await this.dao.deleteReview(model, user);
        return ret
    }

    /**
     * Deletes all reviews for a product
     * @param model The model of the product to delete the reviews from
     * @returns A Promise that resolves to nothing
     */
    async deleteReviewsOfProduct(model: string) /**:Promise<void> */ {
        if (!model || !model.trim() || typeof model !== 'string') {
            throw new InvalidParametersError;
        } else {
            const ret = await this.dao.deleteReviewsOfProduct(model);
            return ret
        }
    }

    /**
     * Deletes all reviews of all products
     * @returns A Promise that resolves to nothing
     */
    async deleteAllReviews() /**:Promise<void> */ {
        const ret: any = await this.dao.deleteAllReviews();
        return ret
    }
}

export default ReviewController;