export const getCurrentAdmin = (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      admin: req.admin,
    },
  });
};