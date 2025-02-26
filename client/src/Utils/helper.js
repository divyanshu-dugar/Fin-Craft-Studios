export function sortData(data){
    for(let i = 0; i < data.length - 1; i++){
        for(let j = i + 1; j < data.length; j++){
            if(new Date(data[i].date) < new Date(data[j].date)){
                let temp = data[i];
                data[i] = data[j];
                data[j] = temp;
            }
        }
    }
    return data;
}