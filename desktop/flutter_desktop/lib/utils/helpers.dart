/// 简化技术栈标签
String simplifyTechLabel(String fullLabel) {
  // 提取主要名称，去掉版本号
  final parts = fullLabel.split(' ');
  return parts.isNotEmpty ? parts.first : fullLabel;
}
