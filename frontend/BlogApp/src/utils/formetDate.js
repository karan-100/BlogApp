function formatDate(date){
    let formatDate=new Date(date).toLocaleDateString();
    return formatDate
}

export default formatDate;