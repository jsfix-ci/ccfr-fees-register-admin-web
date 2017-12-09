import { expect } from 'chai'
import * as config from 'config'
import * as request from 'supertest'
import * as mock from 'nock'

import '../../../../routes/expectations'

import { Paths as AdminPaths } from 'admin/paths'

import { app } from '../../../../../main/app'

import * as feesServiceMock from '../../../../http-mocks/v2/fees'
import * as idamServiceMock from '../../../../http-mocks/idam'

const cookieName: string = config.get<string>('session.cookieName')

describe('Csv fees upload', () => {
  beforeEach(() => {
    mock.cleanAll()
  })

  describe('on GET', () => {
    it('should render csv upload page', async () => {
      idamServiceMock.resolveRetrieveUserFor(1, 'admin', 'admin')

      await request(app)
        .get(AdminPaths.csvUploadPage.uri)
        .set('Cookie', `${cookieName}=JWT`)
        .expect(res => expect(res).to.be.successful.withText('CSV upload'))
    })
  })

  describe('on POST save CSV fixed fees', () => {
    it('should render the save CSV fees confirmation page', async () => {
      feesServiceMock.createBulkFixedFee()
      idamServiceMock.resolveRetrieveUserFor(1, 'admin', 'admin')

      await request(app)
        .post(AdminPaths.createBulkFeesPage.uri)
        .set('Cookie', `${cookieName}=JWT`)
        .send({
          csvFees: JSON.stringify([{'feeCode' : 'X0033','feeDescription' : 'xxxRecovery of Land - High Court','feeAmount' : '480','feeVersion' : '1','feeStatus' : 'approved','validFrom' : 'xxx','validTo' : 'xxx','statutoryInstrument' : '2014 No  874(L17)','jurisdiction1' : 'civil','jurisdiction2' : 'high court','service' : 'civil money claims','event' : 'issue','channel' : 'default','direction' : 'enhanced','feeType' : 'fixed','amountType' : 'flat','feeOrderName' : 'XXX','naturalAccountCode' : 'XXX','memoLine' : 'XXX','siRefId' : 'XXX'},{'feeCode' : 'X0034','feeDescription' : 'xxxRecovery of Land - County Court','feeAmount' : '355','feeVersion' : '1','feeStatus' : 'approved','validFrom' : 'xxx','validTo' : 'xxx','statutoryInstrument' : 'XXX','jurisdiction1' : 'civil','jurisdiction2' : 'county court','service' : 'civil money claims','event' : 'issue','channel' : 'default','direction' : 'enhanced','feeType' : 'fixed','amountType' : 'flat','feeOrderName' : 'XXX','naturalAccountCode' : 'XXX','memoLine' : 'XXX','siRefId' : 'XXX'}])
        })
        .expect(res => expect(res).to.be.successful.withText('Create csv fees confirmation'))
    })
  })
})
