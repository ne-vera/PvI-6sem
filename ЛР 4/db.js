const util = require('util');  
const ee = require('events'); 

let db_data = [
    { id: 1, name: 'user-1', bday: '17-07-2002' },
    { id: 2, name: 'user-2',  bday: '18-07-2002' },
    { id: 3, name: 'user-3',  bday: '19-07-2002' },
    { id: 4, name: 'user-4', bday: '20-07-2002' }
];

function DB() {
    this.get = () => {return db_data;}; 
    this.post = row => {
        let ind = db_data.findIndex(item => item.id == row.id);
        ind  == -1 ? db_data.push(row) : null;
        return db_data;
    };
    this.delete = row => {
        let ind = db_data.findIndex(item => item.id === parseInt(row));
        ind != -1 ? db_data.splice(ind, 1):null;
        return db_data;
    };
    this.put = row => {
        let ind = db_data.findIndex(item => item.id == row.id);
        ind != -1 ? db_data.splice(ind, 1, row) : null;
        return db_data;
    };
    this.commit = () => {};
}

util.inherits(DB, ee.EventEmitter);
exports.DB = DB;