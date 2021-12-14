const formidable = require('formidable');
const { parseTransactionFromFile } = require('./fileHelper');
const fileService = require('./fileService');

class fileController {
    async uploadFile(req, res, next) {
        const form = formidable({ multiples: true });
        form.parse(req, async (err, fields, files) => {
            if (err) {
              next(err);
              return;
            }
            const result = await parseTransactionFromFile(files.file);
            if(!result?.isSuccess) {
                res.status(400).json(result);
                return;
            }
            console.log(result.transactions);
            await fileService.saveTransactions(result.transactions);
            res.json({
                isSuccess: true
            });
        });
    }
}

module.exports = new fileController();