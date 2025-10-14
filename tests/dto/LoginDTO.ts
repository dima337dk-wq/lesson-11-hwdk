export class LoginDTO {
  private readonly username: string
  private readonly password: string

  private constructor(username: string, password: string) {
    this.username = username
    this.password = password
  }

  static createLoginWithCorrectData(): LoginDTO {
    return new LoginDTO(process.env.username || '', process.env.password || '')
  }

  static createLoginWithBrokenData(): LoginDTO {
    return new LoginDTO('', '')
  }
}
