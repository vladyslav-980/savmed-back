export const getHealth = (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "SavMed API is working",
    });
};