import * as _ from 'lodash';

export class Profile {
    name: String
    age: Number
    phone: String
    mail: String
    avatar: String
    description: String
    school: String
    tags: String[]
    job: String

    constructor(json: Object) {
        this.name = _.get(json, 'name', 'Unknown');
        this.age = _.get(json, 'age', 0);
        this.phone = _.get(json, 'phone', 'Unknown');
        this.mail = _.get(json, 'mail', 'Unknown');
        this.school = _.get(json, 'school', 'Unknown');
        this.avatar = _.get(json, 'avatar', '../../img/default_avatar.jpg');
        this.description = _.get(json, 'description', 'Unknown');
        this.tags = _.get(json, 'tags', 'Unknown').split(',');
        this.job = _.get(json, 'job', 'Unknown');
    }
}
