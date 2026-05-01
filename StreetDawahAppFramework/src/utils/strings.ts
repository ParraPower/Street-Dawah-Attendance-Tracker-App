import _ from 'lodash'

export const isNotNullOrEmtpy = (str: string | undefined | null) => !_.isNull(str) && !_.isEmpty(_.trim(str))