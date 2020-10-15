import Product from "../../models/Product";
import connectDb from "../../utils/connectDb";
import nc from "next-connect";
import Cors from "cors";

connectDb();

export default nc({
  onError(error, req, res) {
    res.status(501).send(`something went wrong ${error}`);
  },
  onNoMatch(req, res) {
    req.status(405).send(`method ${req.method} not allowed`);
  },
})
  .use(Cors)
  .get(async (req, res) => {
    const { page, size } = req.query;
    const pageNum = Number(page);
    const pageSize = Number(size);
    const totalDocs = await Product.countDocuments();
    const totalPages = Math.ceil(totalDocs / pageSize);
    let products;
    if (pageNum === 1) {
      products = await Product.find().sort({ name: "asc" }).limit(pageSize);
    } else {
      const skips = pageSize * (pageNum - 1);
      products = await Product.find()
        .sort({ name: "asc" })
        .skip(skips)
        .limit(pageSize);
    }

    res.status(200).json({ products, totalPages });
  });

// export default async function (req, res) {
//   const { page, size } = req.query;
//   const pageNum = Number(page);
//   const pageSize = Number(size);
//   const totalDocs = await Product.countDocuments();
//   const totalPages = Math.ceil(totalDocs / pageSize);
//   let products;
//   if (pageNum === 1) {
//     products = await Product.find().sort({ name: 'asc' }).limit(pageSize);
//   } else {
//     const skips = pageSize * (pageNum - 1);
//     products = await Product.find()
//       .sort({ name: 'asc' })
//       .skip(skips)
//       .limit(pageSize);
//   }

//   res.status(200).json({ products, totalPages });
// }
