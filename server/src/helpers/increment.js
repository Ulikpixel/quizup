import Counter from "../models/counter.js"

export const increment = ({ model, name }) => {
    model.pre('save', function (next) {
        Counter.findOneAndUpdate({ name }, { $inc: { count: 1 } }, { new: true })
            .then(data => {
                this._id = data.count;
                next();
            })
            .catch((err) => next(err))
    })
};