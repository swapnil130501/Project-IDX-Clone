import Docker from "dockerode";

const docker = new Docker();

export const handleContainerCreate = async(projectId, socket) => {
    try {
        console.log('project id received for container create', projectId);
    
        const container = await docker.createContainer({
            Image: 'sandbox',
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            CMD: ['/bin/bash'],
            Tty: true,
            User: 'sandbox',
            HostConfig: {
                Binds: [ // mounting the project directory to the container
                    `${process.cwd()}/projects/${projectId}:/home/sandbox/app`
                ],
                PortBindings: {
                    "5173/tcp": [
                        {
                            "HostPort": "0" // random port will be assigned by docker
                        }
                    ]
                },
                ExposedPorts: {
                    "5173/tcp": {}
                },
                Env: ["HOST=0.0.0.0"]
            }
        });
    
        console.log("container created", container.id);
        await container.start();
        console.log('container started successfully');

        container.exec({
            Cmd: ['/bin/bash'],
            User: 'sandbox',
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
        }, (err, exec) => {
            if(err) {
                console.log('error while creating exec', err);
                return;
            }

            exec.start({ hijack: true }, (err, stream) => {
                if(err) {
                    console.log('error while starting exec', err);
                    return;
                }

                processStream(stream, socket);

                socket.on('shell-input', (data) => {
                    stream.write('ls\n');
                });
            })
        })

    } catch (error) {
        console.log('error while creating container', error)
    }
}

function processStream(stream, socket) {
    let buffer = Buffer.from('');
    stream.on('data', (data) => {
        buffer = Buffer.concat([buffer, data]);
        socket.emit('shell-output', buffer.toString());
        buffer = Buffer.from('');
    });

    stream.on('end', () => {
        console.log('stream ended');
        socket.emit('shell-output', 'stream ended');
    });

    stream.on('error', () => {
        console.log('stream closed', err);
        socket.emit('shell-output', 'stream err');
    });
}