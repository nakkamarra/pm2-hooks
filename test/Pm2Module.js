/**
 * Created by desaroger on 25/02/17.
 */

let _ = require('lodash');
let Pm2Module = require('../src/Pm2Module');
let WebhookServer = require('../src/WebhookServer');
let mockApps = require('./mocks/apps');
let { expect } = require('./assets');

describe('Pm2Module', () => {
    it('is a function', () => {
        expect(Pm2Module).to.be.a('function');
    });

    it('can be instantiated', () => {
        expect(() => new Pm2Module()).to.not.throw();
    });

    describe('instance', (pm2Module) => {
        before(() => {
            let apps = [
                wrapEnv('a', { type: 'github' }),
                wrapEnv('b', { type: 'bitbucket' }),
                wrapEnv('c', { type: 'gitlab' }),
                wrapEnv('d', { })
            ];
            pm2Module = new Pm2Module(apps);
        });

        it('has the method start', () => {
            expect(pm2Module.start).to.be.a('function');
        });

        it('has the method stop', () => {
            expect(pm2Module.stop).to.be.a('function');
        });

        it('has created the server, but not started', () => {
            expect(pm2Module.webhookServer).to.be.an.instanceOf(WebhookServer);
            expect(pm2Module.webhookServer.isRunning()).to.equal(false);
        });

        it('the server has the routes created', () => {
            let routes = pm2Module.webhookServer.options.routes;
            expect(routes.a).to.shallowDeepEqual({ type: 'github' });
            expect(routes.b).to.shallowDeepEqual({ type: 'bitbucket' });
            expect(routes.c).to.shallowDeepEqual({ type: 'gitlab' });
            expect(routes.d).to.be.an('object');
            expect(routes.d.type).to.not.be.ok;
        });
    });

    describe('method _parseProcesses', () => {
        it('exists', () => {
            expect(Pm2Module._parseProcesses).to.be.a('function');
        });

        it('accepts a void array', () => {
            let result = Pm2Module._parseProcesses([]);
            expect(result).to.deep.equal({});
        });

        it('sets "unknown" as default name', () => {
            let result = Pm2Module._parseProcesses([wrapEnv()]);
            expect(Object.keys(result)).to.have.length(1);
            expect(result.unknown).to.be.ok;
        });

        it('works with a real processes array', () => {
            let result = Pm2Module._parseProcesses(mockApps);
            expect(result).to.have.all.keys(['api', 'api2', 'panel'])
            expect(result).to.shallowDeepEqual({
                api: {
                    type: 'bitbucket'
                },
                api2: {},
                panel: {
                    type: 'gitlab'
                }
            });
        });
    });

    describe('method _parseProcess', () => {
        it('exists', () => {
            expect(Pm2Module._parseProcess).to.be.a('function');
        });

        it('returns false if no options specified', () => {
            let objs = {
                a: undefined,
                b: null,
                c: {},
                d: { pm2_env: {} }
            };
            _.values(objs)
                .forEach((opts) => {
                    expect(Pm2Module._parseProcess(opts)).to.equal(null);
                });
        });

        it('returns the route if valid object', () => {
            let obj = wrapEnv('lol', { type: 'bitbucket' });
            let result = Pm2Module._parseProcess(obj);
            expect(result).to.shallowDeepEqual({
                name: 'lol',
                type: 'bitbucket'
            });
        });
    });
});

function wrapEnv(name, envHook = {}) {
    return { name, pm2_env: { env_hook: envHook } };
}
