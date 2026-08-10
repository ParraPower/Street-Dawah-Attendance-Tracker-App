import _ from 'lodash'

export const isNotNullOrEmpty = (str: string | undefined | null) => !_.isNull(str) && !_.isEmpty(_.trim(str))