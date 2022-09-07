export class ClientRequest {
  constructor(public method: string,
              public resource: string,
              public body: string) {}
}
