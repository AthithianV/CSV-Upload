import { getDataRepo, getFileRepo, parseFileRepo } from "./file.repository.js";

export const parseFile = async (req, res, next) => {
  try {
    const filename = req.file.filename;
    const result = await parseFileRepo("./uploads/" + filename, filename);
    const files = await getFileRepo();
    if (!result.success) {
      console.log(result.msg);
      return res.status(200).render("index.ejs", { error: result.msg, files });
    }

    res.status(200).render("index.ejs", { error: null, files });
  } catch (error) {
    throw error;
  }
};

export const getFiles = async (req, res, next) => {
  try {
    await getFileRepo();
  } catch (error) {
    throw error;
  }
};

export const getData = async (req, res, next) => {
  try {
    const { collection, page, searchKey, sortBy } = req.query;
    const { data, pageNo, pages, columns } = await getDataRepo(
      collection,
      page,
      searchKey,
      sortBy
    );

    let error = null;
    if (data.length == 0) {
      error = "NO MATCH FOUND";
    }

    res.status(200).render("file", {
      collection,
      file: data,
      columns: columns.filter((column) => column != "Index"),
      pageNo,
      pages,
      error,
    });
  } catch (error) {
    throw error;
  }
};
