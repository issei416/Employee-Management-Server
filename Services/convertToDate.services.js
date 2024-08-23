import moment from "moment";

const converTotDate = (dateString,format) => {
    return moment(dateString,format).toDate();
};

export default converTotDate;