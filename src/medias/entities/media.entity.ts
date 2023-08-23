export class Media {

    private _title : string
    private _username: string

    constructor(title: string, username: string){
        this._title = title
        this._username = username
    }

    title():string{
        return this._title
    }

    username():string{
        return this._username
    }
}
