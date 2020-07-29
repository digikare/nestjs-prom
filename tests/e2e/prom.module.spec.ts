import { Server } from "http";
import { INestApplication } from "@nestjs/common";
import { Test } from '@nestjs/testing';
import { AppModule } from "../src/app.module";
import * as request from 'supertest';

describe('PromModule', () => {

    let server: Server;
    let app: INestApplication;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = module.createNestApplication();
        server = app.getHttpServer();
        await app.init();
    });

    it(`/metrics should works`, (done) => {
        request(server)
            .get('/metrics')
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
        it('app_AppController_PromMethodCounter_1_calls_total not present in /metrics', (done) => {
            request(server)
                .get('/metrics')
                .expect(200)
                .end((err, { text }) => {
                    if (err) throw err;
                    expect(text).toBeTruthy();
                    expect(/http_requests_total$/.test(text)).toBeFalsy();
                    expect(/app_AppController_PromMethodCounter_1_calls_total/.test(text)).toBeFalsy()
                    done();
                });
        }); 

        it('app_AppController_PromMethodCounter_1_calls_total present in /metrics', async () => {

            await request(server)
                .get('/PromMethodCounter_1')
                .expect(200)
                .expect('PromMethodCounter_1');

            return request(server)
                .get('/metrics')
                .expect(200)
                .expect(/http_requests_total{[^}]*path="\/PromMethodCounter_1"[^}]*} 1/)
                .expect(/app_AppController_PromMethodCounter_1_calls_total/)
                ;
        });
    });

    describe('@PromCounter()', () => {
        it('app_test_counter_1 not defined in /metrics', (done) => {
            request(server)
                .get('/metrics')
                .expect(200)
                .end((err, { text }) => {
                    if (err) throw err;
                    expect(text).toBeTruthy();
                    expect(/http_requests_total$/.test(text)).toBeFalsy();
                    expect(/app_test_counter_1{app="1\.0\.0"}/.test(text)).toBeFalsy();
                    done();
                });
        });

        it('app_test_counter_1 defined in /metrics', async () => {

            await request(server)
                .get('/PromCounter_1')
                .expect(200)
                .expect('PromCounter_1');

            return request(server)
                .get('/metrics')
                .expect(200)
                .expect(/http_requests_total{[^}]*path="\/PromCounter_1"[^}]*} 1/)
                .expect(/app_test_counter_1{app="v1\.0\.0"} 1/);
        });
    });


    describe('Service Injection', () => {
        it('app_counter_service_1 not defined in /metrics', (done) => {
            request(server)
                .get('/metrics')
                .expect(200)
                .end((err, { text }) => {
                    if (err) throw err;
                    expect(text).toBeTruthy();
                    expect(/http_requests_total$/.test(text)).toBeFalsy();
                    expect(/^app_counter_service_1{app="1\.0\.0"}/.test(text)).toBeFalsy();
                    done();
                });
        });

        it('app_counter_service_1 defined in /metrics', async () => {

            await request(server)
                .get('/PromCounterService_1')
                .expect(200)
                .expect('PromCounterService_1');

            return request(server)
                .get('/metrics')
                .expect(200)
                .expect(/http_requests_total{[^}]*path="\/PromCounterService_1"[^}]*} 1/)
                .expect(/app_counter_service_1{app="v1\.0\.0"} 1/);
        });
    });

    // app_MyObj_instances_total
    describe(`@PromInstanceCounter()`, () => {
        it('app_MyObj_instances_total not defined in /metrics', (done) => {
            request(server)
                .get('/metrics')
                .expect(200)
                .end((err, { text }) => {
                    if (err) throw err;
                    expect(text).toBeTruthy();
                    expect(/http_requests_total$/.test(text)).toBeFalsy();
                    expect(/app_MyObj_instances_total{app="1\.0\.0"}/.test(text)).toBeFalsy();
                    done();
                });
        });

        it('app_MyObj_instances_total defined in /metrics', async () => {

            await request(server)
                .get('/PromInstanceCounter_1')
                .expect(200)
                .expect('PromInstanceCounter_1');

            return request(server)
                .get('/metrics')
                .expect(200)
                .expect(/http_requests_total{[^}]*path="\/PromInstanceCounter_1"[^}]*} 1/)
                .expect(/app_MyObj_instances_total{app="v1\.0\.0"} 1/);
        });
    });
});
