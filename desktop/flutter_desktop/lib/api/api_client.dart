import 'package:dio/dio.dart';
import '../models/models.dart';

/// API 客户端 - 统一 API 层
class ApiClient {
  static const String baseUrl = 'http://localhost:8080/api/v1';
  
  final Dio _dio;

  ApiClient() : _dio = Dio(BaseOptions(
    baseUrl: baseUrl,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
    headers: {'Content-Type': 'application/json'},
  ));

  /// 创建时间胶囊
  Future<Capsule> createCapsule(CreateCapsuleForm form) async {
    try {
      final response = await _dio.post(
        '/capsules',
        data: form.toJson(),
      );
      
      final apiResponse = ApiResponse<Capsule>.fromJson(
        response.data,
        (json) => Capsule.fromJson(json as Map<String, dynamic>),
      );

      if (!apiResponse.success) {
        throw Exception(apiResponse.message ?? '创建失败');
      }

      return apiResponse.data!;
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? '网络错误');
    }
  }

  /// 查询胶囊详情
  Future<Capsule> getCapsule(String code) async {
    try {
      final response = await _dio.get('/capsules/$code');
      
      final apiResponse = ApiResponse<Capsule>.fromJson(
        response.data,
        (json) => Capsule.fromJson(json as Map<String, dynamic>),
      );

      if (!apiResponse.success) {
        throw Exception(apiResponse.message ?? '查询失败');
      }

      return apiResponse.data!;
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? '网络错误');
    }
  }

  /// 管理员登录
  Future<String> adminLogin(String password) async {
    try {
      final response = await _dio.post(
        '/admin/login',
        data: {'password': password},
      );
      
      final apiResponse = ApiResponse<AdminToken>.fromJson(
        response.data,
        (json) => AdminToken.fromJson(json as Map<String, dynamic>),
      );

      if (!apiResponse.success) {
        throw Exception(apiResponse.message ?? '登录失败');
      }

      return apiResponse.data!.token;
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? '网络错误');
    }
  }

  /// 获取管理员胶囊列表
  Future<PageData<Capsule>> getAdminCapsules(String token, {int page = 0, int size = 20}) async {
    try {
      final response = await _dio.get(
        '/admin/capsules',
        queryParameters: {'page': page, 'size': size},
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      final apiResponse = ApiResponse<PageData<Capsule>>.fromJson(
        response.data,
        (json) => PageData<Capsule>.fromJson(
          json as Map<String, dynamic>,
          (item) => Capsule.fromJson(item as Map<String, dynamic>),
        ),
      );

      if (!apiResponse.success) {
        throw Exception(apiResponse.message ?? '获取列表失败');
      }

      return apiResponse.data!;
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? '网络错误');
    }
  }

  /// 删除胶囊
  Future<void> deleteCapsule(String token, String code) async {
    try {
      final response = await _dio.delete(
        '/admin/capsules/$code',
        options: Options(headers: {'Authorization': 'Bearer $token'}),
      );
      
      final apiResponse = ApiResponse<dynamic>.fromJson(
        response.data,
        null,
      );

      if (!apiResponse.success) {
        throw Exception(apiResponse.message ?? '删除失败');
      }
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? '网络错误');
    }
  }

  /// 健康检查
  Future<HealthInfo> getHealthInfo() async {
    try {
      final response = await _dio.get('/health');
      
      final apiResponse = ApiResponse<HealthInfo>.fromJson(
        response.data,
        (json) => HealthInfo.fromJson(json as Map<String, dynamic>),
      );

      if (!apiResponse.success) {
        throw Exception(apiResponse.message ?? '健康检查失败');
      }

      return apiResponse.data!;
    } on DioException catch (e) {
      throw Exception(e.response?.data?['message'] ?? '网络错误');
    }
  }
}
