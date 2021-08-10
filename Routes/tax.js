module.exports = (tax, knex) => {

    // Get all Taxes
    tax.get('/tax', (req, res) => {
        knex
            .select('*')
            .from('tax')
            .then((data) => {
                console.log(data)
                res.send(data)
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    });

    // Get by taxe id
    tax.get('/tax/:tax_id', (req, res) => {
        const tax_id = req.params.tax_id;
        knex
            .select('*')
            .from('tax')
            .where('tax_id', tax_id)
            .then((data) => {
                console.log(data)
                res.send(data)
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    });
}