
export type ContractPackage = {
    abi: object,
    tvc: string,
}

export const contracts: {[index: string]: any} = {
    debot1: {
        2: {
            abi: {
                "ABI version": 2,
                "version": "2.3",
                "header": ["pubkey", "time", "expire"],
                "functions": [
                    {
                        "name": "getDebotInfo",
                        "id": "0xDEB",
                        "inputs": [
                        ],
                        "outputs": [
                            {"name":"name","type":"string"},
                            {"name":"version","type":"string"},
                            {"name":"publisher","type":"string"},
                            {"name":"caption","type":"string"},
                            {"name":"author","type":"string"},
                            {"name":"support","type":"address"},
                            {"name":"hello","type":"string"},
                            {"name":"language","type":"string"},
                            {"name":"dabi","type":"string"},
                            {"name":"icon","type":"bytes"}
                        ]
                    },
                    {
                        "name": "getRequiredInterfaces",
                        "inputs": [
                        ],
                        "outputs": [
                            {"name":"interfaces","type":"uint256[]"}
                        ]
                    },
                    {
                        "name": "start",
                        "inputs": [
                        ],
                        "outputs": [
                        ]
                    },
                    {
                        "name": "getDebotOptions",
                        "inputs": [
                        ],
                        "outputs": [
                            {"name":"options","type":"uint8"},
                            {"name":"debotAbi","type":"string"},
                            {"name":"targetAbi","type":"string"},
                            {"name":"targetAddr","type":"address"}
                        ]
                    },
                    {
                        "name": "setABI",
                        "inputs": [
                            {"name":"dabi","type":"string"}
                        ],
                        "outputs": [
                        ]
                    },
                    {
                        "name": "constructor",
                        "inputs": [
                        ],
                        "outputs": [
                        ]
                    }
                ],
                "data": [
                ],
                "events": [
                ],
                "fields": [
                    {"name":"_pubkey","type":"uint256"},
                    {"name":"_timestamp","type":"uint64"},
                    {"name":"_constructorFlag","type":"bool"},
                    {"name":"m_options","type":"uint8"},
                    {"name":"m_debotAbi","type":"optional(string)"},
                    {"name":"m_targetAbi","type":"optional(string)"},
                    {"name":"m_target","type":"optional(address)"},
                    {"name":"_icon","type":"bytes"}
                ]
            },
            tvc: 'te6ccgECJgEABKMAAgE0AwEBAcACAEPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgBCSK7VMg4wMgwP/jAiDA/uMC8gsjBQQlAsjtRNDXScMB+GYh2zzTAAGOIoMI1xgg+CjIzs7J+QAB0wABlNP/AwGTAvhC4iD4ZfkQ8qiV0wAB8nri0z8B+EMhufK0IPgjgQPoqIIIG3dAoLnytPhj0x8B+CO88rnTHwHbPPI8CQYDSu1E0NdJwwH4ZiLQ1wsDqTgA3CHHAOMCIdcNH/K8IeMDAds88jwiIgYCKCCCECJZowq74wIgghBotV8/u+MCDAcCKCCCEFhkLQq64wIgghBotV8/uuMCCggCIjD4Qm7jAPhG8nPR+ADbPPIACRICXO1E0NdJwgGOo3DtRND0BXBtXyCI+G74bfhs+Gv4aoBA9A7yvdcL//hicPhj4w0lIQN0MPhG8uBM+EJu4wDR2zwhjiIj0NMB+kAwMcjPhyDOghDYZC0KzwuBAW8iAssf9ADJcPsAkTDi4wDyACELGABqgvCHllNjZu4hhS21bcy2C8VkWYthjIZfxQyLGrdAu6Eo43BtcZxYyMv/IqQDWIAg9EPkbwIESiCBDeu64wIgghAFnA1vuuMCIIIQDgiJd7rjAiCCECJZowq64wIXEQ8NA3ow+Eby4Ez4Qm7jANHbPCSOJCbQ0wH6QDAxyM+HIM5xzwthXjDIz5KJZowqywfMzM7NyXD7AJJfBOLjAPIAIQ4YAqJw+EtujoGIlvhLIG7yf+L4TG6OgYiW+EwgbvJ/4vhNbo4kjQhgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAElvhNIG7yf+L4SjQlJQMmMPhG8uBM+EJu4wDU0ds82zzyACEQEgAw+EL4RSBukjBw3rry4GT4APhKcbH4avhrAyQw+Eby4Ez4Qm7jANHbPNs88gAhExIAhPhO+E34TPhL+Er4Q/hCyMv/yz/Pg8sHURBukzDPgZQBz4PM4lEQbpMwz4GUAc+DzOJREG6TMM+BlAHPg87izMntVAIIcIjbPBYUARYBicjOyx/MyXD7ABUAbmJww8spsbN3EMKW2rbmWwXisizFsMZDL+KGRY1boF3QlHGcxLQAAAAAAAAAAAAAAAAAAGNny+0ADlN0YXJ0ZWQDlDD4RvLgTPhCbuMA0ds8Ko4xLNDTAfpAMDHIz4cgznHPC2FekMjPkAAAN67MzMxVYMjMzM7MVSDIzMzMzc3NyXD7AJJfCuLjAPIAIRkYACjtRNDT/9M/MfhDWMjL/8s/zsntVAQGiIiIIB8eGgRgiIiNCGADAyouHbQKRPlhC7wXFtEczYV2wyBmXnzEJ7qyQYJt47yIiPhLIG7yf/hOHR4cGwAEZW4AGERlYm90MV9oZWxsbwAcRGVib3QxX2NhcHRpb24AEkV2ZXIgU3VyZgAKMC4xLjEADERlYm90MQBq7UTQ0//TP9MAMdMH0gABb6OR1N7SAAFvo5HU3tIAAW+jkvpA3tTR+G74bfhs+Gv4avhj+GIACvhG8uBMAhD0pCD0vfLATiUkABRzb2wgMC42Ni4wAAA=',
        },
    }
}
