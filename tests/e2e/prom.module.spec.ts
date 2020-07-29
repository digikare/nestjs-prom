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
        it('PromMethodCounter_1 not called first', (done) => {
            request(server)
                .get('/metrics')
                .expect(200)
                .end((err, { text }) => {
                    if (err) throw err;
                    expect(text).toBeTruthy();
                    expect(/^http_requests_total$/.test(text)).toBeFalsy();
                    done();
                });
        }); 

        it('PromMethodCounter_1 logged', async () => {

            await request(server)
                .get('/PromMethodCounter_1')
                .expect(200)
                .expect('PromMethodCounter_1');

            return request(server)
                .get('/metrics')
                .expect(200)
                .expect(/http_requests_total{[^}]*path="\/PromMethodCounter_1"[^}]*} 1/);
        });
    });

    describe('@PromCounter()', () => {
        it('PromMethodCounter_1 not called first', (done) => {
            request(server)
                .get('/metrics')
                .expect(200)
                .end((err, { text }) => {
                    if (err) throw err;
                    expect(text).toBeTruthy();
                    expect(/^http_requests_total$/.test(text)).toBeFalsy();
                    done();
                });
        });

        it('PromMethodCounter_1 logged', async () => {

            await request(server)
                .get('/PromMethodCounter_1')
                .expect(200)
                .expect('PromMethodCounter_1');

            return request(server)
                .get('/metrics')
                .expect(200)
                .expect(/http_requests_total{[^}]*path="\/PromMethodCounter_1"[^}]*} 1/);
        });
    });
});
