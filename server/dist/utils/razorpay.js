import Razorpay from "razorpay";
const checkEnv = (name) => {
    const extractValue = process.env?.[name];
    if (!extractValue) {
        throw new Error(`Missing env: ${name}`);
    }
    return extractValue;
};
export const razorpay = new Razorpay({
    key_id: checkEnv(`RAZORPAY_KEY_ID`),
    key_secret: checkEnv(`RAZORPAY_KEY_SECRET`),
});
export function toSubUnits(amount) {
    return Math.round(amount * 100);
}
//# sourceMappingURL=razorpay.js.map