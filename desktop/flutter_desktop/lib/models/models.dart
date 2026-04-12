/// 时间胶囊数据模型
class Capsule {
  final String code;
  final String title;
  final String? content;
  final String creator;
  final DateTime openAt;
  final DateTime createdAt;
  final bool? opened;

  Capsule({
    required this.code,
    required this.title,
    this.content,
    required this.creator,
    required this.openAt,
    required this.createdAt,
    this.opened,
  });

  factory Capsule.fromJson(Map<String, dynamic> json) {
    return Capsule(
      code: json['code'] as String,
      title: json['title'] as String,
      content: json['content'] as String?,
      creator: json['creator'] as String,
      openAt: DateTime.parse(json['openAt'] as String),
      createdAt: DateTime.parse(json['createdAt'] as String),
      opened: json['opened'] as bool?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'code': code,
      'title': title,
      'content': content,
      'creator': creator,
      'openAt': openAt.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'opened': opened,
    };
  }
}

/// 创建胶囊表单
class CreateCapsuleForm {
  final String title;
  final String content;
  final String creator;
  final DateTime openAt;

  CreateCapsuleForm({
    required this.title,
    required this.content,
    required this.creator,
    required this.openAt,
  });

  Map<String, dynamic> toJson() {
    return {
      'title': title,
      'content': content,
      'creator': creator,
      'openAt': openAt.toIso8601String(),
    };
  }
}

/// 统一 API 响应
class ApiResponse<T> {
  final bool success;
  final T? data;
  final String? message;
  final String? errorCode;

  ApiResponse({
    required this.success,
    this.data,
    this.message,
    this.errorCode,
  });

  factory ApiResponse.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic json)? fromJsonT,
  ) {
    return ApiResponse(
      success: json['success'] as bool,
      data: json['data'] != null && fromJsonT != null
          ? fromJsonT(json['data'])
          : json['data'] as T?,
      message: json['message'] as String?,
      errorCode: json['errorCode'] as String?,
    );
  }
}

/// 分页数据
class PageData<T> {
  final List<T> content;
  final int totalElements;
  final int totalPages;
  final int number;
  final int size;

  PageData({
    required this.content,
    required this.totalElements,
    required this.totalPages,
    required this.number,
    required this.size,
  });

  factory PageData.fromJson(
    Map<String, dynamic> json,
    T Function(dynamic json) fromJsonT,
  ) {
    return PageData(
      content: (json['content'] as List)
          .map((item) => fromJsonT(item))
          .toList(),
      totalElements: json['totalElements'] as int,
      totalPages: json['totalPages'] as int,
      number: json['number'] as int,
      size: json['size'] as int,
    );
  }
}

/// 管理员 Token
class AdminToken {
  final String token;

  AdminToken({required this.token});

  factory AdminToken.fromJson(Map<String, dynamic> json) {
    return AdminToken(
      token: json['token'] as String,
    );
  }
}

/// 技术栈信息
class TechStack {
  final String framework;
  final String language;
  final String database;

  TechStack({
    required this.framework,
    required this.language,
    required this.database,
  });

  factory TechStack.fromJson(Map<String, dynamic> json) {
    return TechStack(
      framework: json['framework'] as String,
      language: json['language'] as String,
      database: json['database'] as String,
    );
  }
}

/// 健康信息
class HealthInfo {
  final String status;
  final String timestamp;
  final TechStack techStack;

  HealthInfo({
    required this.status,
    required this.timestamp,
    required this.techStack,
  });

  factory HealthInfo.fromJson(Map<String, dynamic> json) {
    return HealthInfo(
      status: json['status'] as String,
      timestamp: json['timestamp'] as String,
      techStack: TechStack.fromJson(json['techStack'] as Map<String, dynamic>),
    );
  }
}
