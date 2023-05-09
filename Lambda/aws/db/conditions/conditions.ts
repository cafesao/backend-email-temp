import { Condition } from 'dynamoose'
import { IAttributeFilterEqual } from '../../../interface/conditions'

const conditions = {
  equal: (attributeFilter: IAttributeFilterEqual) =>
    new Condition().where(attributeFilter.filter).eq(attributeFilter.eq),
}

export default conditions
