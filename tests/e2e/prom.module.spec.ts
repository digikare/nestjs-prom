import { Server } from "http";
import { INestApplication } from "@nestjs/common";
import { Test } from '@nestjs/testing';
import { AppModule } from "../src/app.module";
import * as request from 'supertest';

describe('PromModule', () => {

  let server: Server;
  let app: INestApplication;
  const metricPath = '/mymetrics';

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it(`${metricPath} should works`, (done) => {
    request(server)
      .get(metricPath)
      .expect(200)
      .expect('Content-Type', /text\/plain/) // expect correct content-type
      .expect(/app=\"v1\.0\.0\"/) // expect having defaultLabels
      .end((err) => {
        if (err) {
          throw err;
        }
        done();
      });
  });

  describe('@PromMethodCounter()', () => {
    it(`app_AppController_PromMethodCounter_1_calls_total not present in ${metricPath}`, (done) => {
      request(server)
        .get(metricPath)
        .expect(200)
        .end((err, { text }) => {
          if (err) throw err;
          expect(text).toBeTruthy();
          expect(/http_requests_count$/.test(text)).toBeFalsy();
          expect(/http_requests_sum$/.test(text)).toBeFalsy();
          expect(/http_requests_count$/.test(text)).toBeFalsy();
          expect(/app_AppController_PromMethodCounter_1_calls_total/.test(text)).toBeFalsy()
          done();
        });
    });

    it(`app_AppController_PromMethodCounter_1_calls_total present in ${metricPath}`, async () => {

      await request(server)
        .get('/PromMethodCounter_1')
        .expect(200)
        .expect('PromMethodCounter_1');

      return request(server)
        .get(metricPath)
        .expect(200)
        .expect(/http_requests_count{[^}]*path="\/PromMethodCounter_1"[^}]*} 1/)
        .expect(/http_requests_bucket{[^}]*path="\/PromMethodCounter_1"[^}]*} 1/)
        .expect(/http_requests_sum{[^}]*path="\/PromMethodCounter_1"[^}]*} [0-9]+(\.[0-9]+)?/)
        .expect(/app_AppController_PromMethodCounter_1_calls_total/)
        ;
    });
  });

  describe('@PromCounter()', () => {
    it(`app_test_counter_1 not defined in ${metricPath}`, (done) => {
      request(server)
        .get(metricPath)
        .expect(200)
        .end((err, { text }) => {
          if (err) throw err;
          expect(text).toBeTruthy();
          expect(/http_requests_count$/.test(text)).toBeFalsy();
          expect(/http_requests_sum$/.test(text)).toBeFalsy();
          expect(/http_requests_count$/.test(text)).toBeFalsy();
          expect(/app_test_counter_1{app="1\.0\.0"}/.test(text)).toBeFalsy();
          done();
        });
    });

    it(`app_test_counter_1 defined in ${metricPath}`, async () => {

      await request(server)
        .get('/PromCounter_1')
        .expect(200)
        .expect('PromCounter_1');

      return request(server)
        .get(metricPath)
        .expect(200)
        .expect(/http_requests_count{[^}]*path="\/PromCounter_1"[^}]*} 1/)
        .expect(/http_requests_bucket{[^}]*path="\/PromCounter_1"[^}]*} 1/)
        .expect(/http_requests_sum{[^}]*path="\/PromCounter_1"[^}]*} [0-9]+(\.[0-9]+)?/)
        .expect(/app_test_counter_1{app="v1\.0\.0"} 1/);
    });
  });


  describe('Service Injection', () => {
    it(`app_counter_service_1 not defined in ${metricPath}`, (done) => {
      request(server)
        .get(metricPath)
        .expect(200)
        .end((err, { text }) => {
          if (err) throw err;
          expect(text).toBeTruthy();
          expect(/http_requests_count$/.test(text)).toBeFalsy();
          expect(/http_requests_sum$/.test(text)).toBeFalsy();
          expect(/http_requests_count$/.test(text)).toBeFalsy();
          expect(/^app_counter_service_1{app="1\.0\.0"}/.test(text)).toBeFalsy();
          done();
        });
    });

    it(`app_counter_service_1 defined in ${metricPath}`, async () => {

      await request(server)
        .get('/PromCounterService_1')
        .expect(200)
        .expect('PromCounterService_1');

      return request(server)
        .get(metricPath)
        .expect(200)
        .expect(/http_requests_count{[^}]*path="\/PromCounterService_1"[^}]*} 1/)
        .expect(/http_requests_count{[^}]*path="\/PromCounterService_1"[^}]*} 1/)
        .expect(/http_requests_sum{[^}]*path="\/PromCounterService_1"[^}]*} [0-9]+(\.[0-9]+)?/)
        .expect(/app_counter_service_1{app="v1\.0\.0"} 1/);
    });
  });

  // app_MyObj_instances_total
  describe(`@PromInstanceCounter()`, () => {
    it(`app_MyObj_instances_total not defined in ${metricPath}`, (done) => {
      request(server)
        .get(metricPath)
        .expect(200)
        .end((err, { text }) => {
          if (err) throw err;
          expect(text).toBeTruthy();
          expect(/http_requests_bucket$/.test(text)).toBeFalsy();
          expect(/http_requests_sum$/.test(text)).toBeFalsy();
          expect(/http_requests_count$/.test(text)).toBeFalsy();
          expect(/app_MyObj_instances_total{app="1\.0\.0"}/.test(text)).toBeFalsy();
          done();
        });
    });

    it(`app_MyObj_instances_total defined in ${metricPath}`, async () => {

      await request(server)
        .get('/PromInstanceCounter_1')
        .expect(200)
        .expect('PromInstanceCounter_1');

      return request(server)
        .get(metricPath)
        .expect(200)
        .expect(/http_requests_bucket{[^}]*path="\/PromInstanceCounter_1"[^}]*} 1/)
        .expect(/http_requests_count{[^}]*path="\/PromInstanceCounter_1"[^}]*} 1/)
        .expect(/http_requests_sum{[^}]*path="\/PromInstanceCounter_1"[^}]*} [0-9]+(\.[0-9]+)?/)
        .expect(/app_MyObj_instances_total{app="v1\.0\.0"} 1/);
    });
  });

  describe(`@PromGauge()`, () => {
    it(`app_test_gauge_1 not defined in ${metricPath}`, (done) => {
      request(server)
        .get(metricPath)
        .expect(200)
        .end((err, { text }) => {
          if (err) throw err;
          expect(text).toBeTruthy();
          expect(/http_requests_bucket$/.test(text)).toBeFalsy();
          expect(/http_requests_sum$/.test(text)).toBeFalsy();
          expect(/http_requests_count$/.test(text)).toBeFalsy();
          expect(/app_test_gauge_1{app="1\.0\.0"}/.test(text)).toBeFalsy();
          done();
        });
    });

    it(`app_test_gauge_1 (increments and decrements) defined in ${metricPath}`, async () => {
      const incrementsCount = 20;
      const decrementsCount = 15;


      for (let i = 0; i < incrementsCount; i++) {
        await request(server)
          .get('/PromGauge_1_increment')
          .expect(200)
          .expect('PromGauge_1_increment');
      }

      for (let i = 0; i < decrementsCount; i++) {
        await request(server)
          .get('/PromGauge_1_decrement')
          .expect(200)
          .expect('PromGauge_1_decrement');
      }

      return request(server)
        .get(metricPath)
        .expect(200)
        .expect(new RegExp(
          'http_requests_count{[^}]*path="\\/PromGauge_1_increment"[^}]*} ' + incrementsCount
        ))
        .expect(new RegExp(
          'http_requests_count{[^}]*path="\\/PromGauge_1_decrement"[^}]*} ' + decrementsCount
        ))
        .expect(new RegExp('app_test_gauge_1{app="v1\\.0\\.0"} ' + (incrementsCount - decrementsCount)));
    });

    it(`app_test_gauge_1 (set) defined in ${metricPath}`, async () => {
      await request(server)
        .get('/PromGauge_1_set')
        .expect(200)
        .expect('PromGauge_1_set');

      return request(server)
        .get(metricPath)
        .expect(200)
        .expect(new RegExp(
          'http_requests_count{[^}]*path="\\/PromGauge_1_set"[^}]*} ' + 1
        ))
        .expect(new RegExp('app_test_gauge_1{app="v1\\.0\\.0"} ' + 10));
    });
  });
});
