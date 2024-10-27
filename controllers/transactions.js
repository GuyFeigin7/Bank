

async function getTransactions(req, res)
{
    res.status(200).send( {transactions: [{to:"itamar" ,from:"guy", amount:1000},
                           {to:"yaron" ,from:"itamar", amount: -100},
                           {to:"itamar" ,from:"josh", amount: 0.99}]});
}

module.exports = {getTransactions};