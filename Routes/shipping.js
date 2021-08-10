module.exports = (shipping, knex) => {

    // Get all shippings regions
    shipping.get('/shipping/region', (req, res) => {
        knex
            .select('*')
            .from('shipping')
            .then((data) => {
                console.log(data)
                res.send(data)
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    });

    // Get shippings regions by shipping_region id
    shipping.get('/shipping/regions/:shipping_region_id', (req, res) => {
        const shipping_id = req.params.shipping_region_id;
        knex
            .select('*')
            .from('shipping')
            .where('shipping_id', shipping_id)
            .then((data) => {
                console.log(data)
                res.send(data)
            }).catch((err) => {
                console.log({ err: err.message })
                res.send({ err: err.message })
            })
    });
}