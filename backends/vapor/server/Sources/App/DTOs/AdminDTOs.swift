import Vapor

struct AdminLoginRequest: Content, Validatable {
    let password: String

    static func validations(_ validations: inout Validations) {
        validations.add("password", as: String.self, is: !.empty, required: true)
    }
}

struct AdminTokenResponse: Content {
    let token: String
}

struct AdminListCapsulesQuery: Content {
    let page: Int?
    let size: Int?
}
