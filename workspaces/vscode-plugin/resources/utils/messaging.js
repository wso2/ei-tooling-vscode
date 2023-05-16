class WebViewRPCHandler {

    constructor(methods) {
        this._sequence = 1;
        this._callbacks = {};
        this.methods = methods || [];
        this._onRemoteMessage = this._onRemoteMessage.bind(this);
        window.addEventListener('message', this._onRemoteMessage);
    }

    _onRemoteMessage(evt) {
        const msg = evt.data;
        if (msg.id) {
            const methodName = msg.methodName;
            // this is a request from remote
            const method = this.methods.find(method => method.methodName === methodName);
            if (method) {
                method.handler(msg.arguments)
                    .then((response) => {
                        vscode.postMessage({
                            originId: msg.id,
                            response: JSON.stringify(response)
                        });
                    });
            }
        } else if (msg.originId) {
            // this is a response from remote
            const seqId = msg.originId;
            if (this._callbacks[seqId]) {
                this._callbacks[seqId](JSON.parse(msg.response));
                delete this._callbacks[seqId];
            }
        }
    }

    addMethod(methodName, handler = () => { }) {
        this.methods.push({ methodName, handler });
    }

    invokeRemoteMethod(methodName, args, onReply = () => { }) {
        const msg = {
            id: this._sequence,
            methodName: methodName,
            arguments: args,
        }
        this._callbacks[this._sequence] = onReply;
        vscode.postMessage(msg);
        this._sequence++;
    }

    dispose() {
        window.removeEventListener('message', this._onRemoteMessage);
    }
}

var webViewRPCHandler = new WebViewRPCHandler([]);

var vscode = acquireVsCodeApi();


function getLangClient() {
    return {
        isInitialized: true,
        getSyntaxTree: (params) => {
            return new Promise((resolve, _reject) => {
                const start = new Date();
                webViewRPCHandler.invokeRemoteMethod('getSyntaxTree', [params], (resp) => {
                    consoleLog(start, 'getSyntaxTree');
                    // const unzippedResp = pako.inflate(resp.data, { to: 'string' });
                    // resolve(JSON.parse(unzippedResp));
                    resolve(resp);
                });
            });
        },
        getCompletion: (params) => {
            return new Promise((resolve, _reject) => {
                const start = new Date();
                webViewRPCHandler.invokeRemoteMethod('getCompletion', [params], (resp) => {
                    consoleLog(start, 'getCompletion');
                    resolve(resp);
                });
            });
        },
        getSnippetCompletion: (params) => {
            return new Promise((resolve, _reject) => {
                const start = new Date();
                webViewRPCHandler.invokeRemoteMethod('getSnippetCompletion', [params], (resp) => {
                    consoleLog(start, 'getSnippetCompletion');
                    resolve(resp);
                });
            });
        },
        applyChange: (params) => {
            return new Promise((resolve, _reject) => {
                const start = new Date();
                webViewRPCHandler.invokeRemoteMethod('applyChange', [params], (resp) => {
                    consoleLog(start, 'applyChange');
                    resolve(resp);
                });
            });
        },
        hover: (params) => {
            return new Promise(resolve => {
                const start = new Date();
                webViewRPCHandler.invokeRemoteMethod('hover', [params], (resp) => {
                    consoleLog(start, 'hover');
                    resolve(resp);
                })
            });
        },
        getType: (params) => {
            return new Promise((resolve, _reject) => {
                const start = new Date();
                webViewRPCHandler.invokeRemoteMethod('getType', [params], (resp) => {
                    consoleLog(start, 'getType');
                    resolve(resp);
                });
            });
        },
        getDiagnostics: (params) => {
            return new Promise((resolve, _reject) => {
                const start = new Date();
                webViewRPCHandler.invokeRemoteMethod('getDiagnostics', [params], (resp) => {
                    consoleLog(start, 'getDiagnostics');
                    resolve(resp);
                });
            });
        },
        goToSource: (params) => {
            return new Promise((resolve, _reject) => {
                const start = new Date();
                webViewRPCHandler.invokeRemoteMethod(
                    'goToSource',
                    [JSON.stringify(params)],
                    (resp) => {
                        consoleLog(start, 'goToSource');
                        resolve(resp);
                    }
                );
            })
        },
        didOpen: (params) => {
            return new Promise((resolve, _reject) => {
                const start = new Date();
                webViewRPCHandler.invokeRemoteMethod('didOpen', [params], (resp) => {
                    consoleLog(start, 'didOpen');
                    resolve(resp);
                });
            })
        },
        didClose: (params) => {
            return new Promise((resolve, _reject) => {
                const start = new Date();
                webViewRPCHandler.invokeRemoteMethod('didClose', [params], (resp) => {
                    consoleLog(start, 'didClose');
                    resolve(resp);
                });
            })
        },
        didChange: (params) => {
            return new Promise((resolve, _reject) => {
                const start = new Date();
                webViewRPCHandler.invokeRemoteMethod('didChange', [params], (resp) => {
                    consoleLog(start, 'didChange');
                    resolve(resp);
                });
            })
        },
        getDidOpenParams: () => {
            return new Promise((resolve, _reject) => {
                const start = new Date();
                webViewRPCHandler.invokeRemoteMethod('getDidOpenParams', [], (resp) => {
                    consoleLog(start, 'getDidOpenParams');
                    resolve(resp);
                });
            })
        },
        codeAction: (params) => {
            return new Promise((resolve, _reject) => {
                const start = new Date();
                webViewRPCHandler.invokeRemoteMethod('codeAction', [params], (resp) => {
                    consoleLog(start, 'codeAction');
                    resolve(resp);
                });
            })
        }
    }
}

function consoleLog(start, fnName) {
    const end = new Date();
    console.log(`Frontend - Time taken for ${fnName}: ${end - start}ms`);
}
