function prettyDate(element){

    let date = new Date(element.createdAt);
    element["prettyDate"] = date.getDate() + "/" + parseInt(date.getMonth()+1) + "/" + date.getFullYear();
    return element;
}

module.exports =  prettyDate;