export class Publication {

    private _mediaId: number
    private _postId: number
    private _date: Date

    constructor(_mediaId: number, _postId: number, _date: Date){
        this._mediaId = _mediaId
        this._postId = _postId
        this._date = _date
    }
}
