import Foundation
import Observation

// MARK: - App Navigation Routes
enum Route: String, CaseIterable, Hashable {
    case home
    case create
    case open
    case admin
    case about
}

// MARK: - App-level global state (@Observable, Swift 5.9+)
@Observable
final class AppState {

    // MARK: - API configuration
    var apiBaseURLString: String = "http://localhost:8080/api/v1" {
        didSet { UserDefaults.standard.set(apiBaseURLString, forKey: "apiBaseURL") }
    }

    // MARK: - UI State
    var navPath: [Route] = []
    var isDarkMode: Bool = true
    
    // MARK: - Admin session (mirrors sessionStorage JWT in web)
    var adminToken: String? = nil
    var isAdminLoggedIn: Bool { adminToken != nil }

    // MARK: - Loading / error helpers
    var isLoading: Bool = false
    var errorMessage: String? = nil

    // MARK: - Tech Stack
    var techStack: TechStack? = nil
    var isTechStackLoading: Bool = true
    var techStackError: Bool = false

    // MARK: - Capsule fetched by code
    var fetchedCapsule: Capsule? = nil

    // MARK: - Admin capsule list
    var adminCapsules: [Capsule] = []
    var adminPageInfo: PageData<Capsule>? = nil

    // MARK: - Init (restore persisted base URL)
    init() {
        if let saved = UserDefaults.standard.string(forKey: "apiBaseURL"), !saved.isEmpty {
            apiBaseURLString = saved
        }
    }

    // MARK: - Client factory
    var apiClient: APIClient {
        guard let url = URL(string: apiBaseURLString), !apiBaseURLString.isEmpty else {
            return APIClient(baseURL: URL(string: "http://localhost:8080/api/v1")!)
        }
        return APIClient(baseURL: url)
    }

    // MARK: - Capsule operations

    @MainActor
    func createCapsule(title: String, content: String, creator: String, openAt: Date) async throws -> Capsule {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        let req = CreateCapsuleRequest(title: title, content: content, creator: creator, openAt: openAt)
        return try await apiClient.createCapsule(req)
    }

    @MainActor
    func fetchCapsule(code: String) async throws {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        let capsule = try await apiClient.getCapsule(code: code)
        fetchedCapsule = capsule
    }

    func clearFetchedCapsule() {
        fetchedCapsule = nil
    }

    // MARK: - Tech Stack fetching

    @MainActor
    func fetchTechStack() async {
        isTechStackLoading = true
        techStackError = false
        do {
            let healthData = try await apiClient.health()
            techStack = healthData.techStack
            isTechStackLoading = false
        } catch {
            techStackError = true
            isTechStackLoading = false
        }
    }

    // MARK: - Admin operations

    @MainActor
    func adminLogin(password: String) async throws {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        let tokenResp = try await apiClient.adminLogin(password: password)
        adminToken = tokenResp.token
    }

    func adminLogout() {
        adminToken = nil
        adminCapsules = []
        adminPageInfo = nil
    }

    @MainActor
    func fetchAdminCapsules(page: Int = 0) async throws {
        guard let token = adminToken else { return }
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        let pageData = try await apiClient.adminCapsules(token: token, page: page, size: 20)
        adminCapsules = pageData.content
        adminPageInfo = pageData
    }

    @MainActor
    func deleteAdminCapsule(code: String) async throws {
        guard let token = adminToken else { return }
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        try await apiClient.deleteCapsule(token: token, code: code)
        adminCapsules.removeAll { $0.code == code }
    }
}
