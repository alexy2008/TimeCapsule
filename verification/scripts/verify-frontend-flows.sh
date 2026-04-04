#!/bin/bash
# 前端通用验证脚本
# 兼容 macOS 默认 Bash 3.x

set -u

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"

if [ "$#" -eq 0 ]; then
  SELECTED_FRONTENDS="react-ts vue3-ts angular-ts svelte-ts next-ts nuxt-ts spring-boot-mvc"
else
  SELECTED_FRONTENDS="$*"
fi

FAILED_COUNT=0
SUMMARY_LINES=""

print_divider() {
  echo "------------------------------------------------------------"
}

label_for() {
  case "$1" in
    react-ts) echo "React" ;;
    vue3-ts) echo "Vue" ;;
    angular-ts) echo "Angular" ;;
    svelte-ts) echo "Svelte" ;;
    next-ts) echo "Next" ;;
    nuxt-ts) echo "Nuxt" ;;
    spring-boot-mvc) echo "Spring MVC" ;;
    *) echo "Unknown" ;;
  esac
}

dir_for() {
  case "$1" in
    react-ts) echo "$ROOT_DIR/frontends/react-ts" ;;
    vue3-ts) echo "$ROOT_DIR/frontends/vue3-ts" ;;
    angular-ts) echo "$ROOT_DIR/frontends/angular-ts" ;;
    svelte-ts) echo "$ROOT_DIR/frontends/svelte-ts" ;;
    next-ts) echo "$ROOT_DIR/fullstacks/next-ts" ;;
    nuxt-ts) echo "$ROOT_DIR/fullstacks/nuxt-ts" ;;
    spring-boot-mvc) echo "$ROOT_DIR/fullstacks/spring-boot-mvc" ;;
    *) return 1 ;;
  esac
}

home_file_for() {
  case "$1" in
    react-ts) echo "$ROOT_DIR/frontends/react-ts/src/views/HomeView.tsx" ;;
    vue3-ts) echo "$ROOT_DIR/frontends/vue3-ts/src/views/HomeView.vue" ;;
    angular-ts) echo "$ROOT_DIR/frontends/angular-ts/src/app/views/home/home.component.html" ;;
    svelte-ts) echo "$ROOT_DIR/frontends/svelte-ts/src/views/Home.svelte" ;;
    next-ts) echo "$ROOT_DIR/fullstacks/next-ts/src/app/page.tsx" ;;
    nuxt-ts) echo "$ROOT_DIR/fullstacks/nuxt-ts/pages/index.vue" ;;
    spring-boot-mvc) echo "$ROOT_DIR/fullstacks/spring-boot-mvc/src/main/resources/templates/index.html" ;;
    *) return 1 ;;
  esac
}

home_data_file_for() {
  case "$1" in
    angular-ts) echo "$ROOT_DIR/frontends/angular-ts/src/app/views/home/home.component.ts" ;;
    next-ts) echo "$ROOT_DIR/fullstacks/next-ts/src/app/page.tsx" ;;
    nuxt-ts) echo "$ROOT_DIR/fullstacks/nuxt-ts/pages/index.vue" ;;
    spring-boot-mvc) echo "$ROOT_DIR/fullstacks/spring-boot-mvc/src/main/resources/templates/index.html $ROOT_DIR/fullstacks/spring-boot-mvc/src/main/java/com/hellotime/view/ViewModelAdvice.java" ;;
    *) home_file_for "$1" ;;
  esac
}

frontend_logo_for() {
  case "$1" in
    react-ts) echo "$ROOT_DIR/frontends/react-ts/public/frontend.svg" ;;
    vue3-ts) echo "$ROOT_DIR/frontends/vue3-ts/public/frontend.svg" ;;
    angular-ts) echo "$ROOT_DIR/frontends/angular-ts/src/assets/frontend.svg" ;;
    svelte-ts) echo "$ROOT_DIR/frontends/svelte-ts/public/frontend.svg" ;;
    next-ts) echo "$ROOT_DIR/fullstacks/next-ts/public/frontend.svg" ;;
    nuxt-ts) echo "$ROOT_DIR/fullstacks/nuxt-ts/public/frontend.svg" ;;
    spring-boot-mvc) echo "$ROOT_DIR/fullstacks/spring-boot-mvc/src/main/resources/static/stack-logos/spring-boot.svg" ;;
    *) return 1 ;;
  esac
}

language_logo_for() {
  case "$1" in
    react-ts) echo "$ROOT_DIR/frontends/react-ts/public/frontend-language.svg" ;;
    vue3-ts) echo "$ROOT_DIR/frontends/vue3-ts/public/frontend-language.svg" ;;
    angular-ts) echo "$ROOT_DIR/frontends/angular-ts/src/assets/frontend-language.svg" ;;
    svelte-ts) echo "$ROOT_DIR/frontends/svelte-ts/public/frontend-language.svg" ;;
    next-ts) echo "$ROOT_DIR/fullstacks/next-ts/public/frontend-language.svg" ;;
    nuxt-ts) echo "$ROOT_DIR/fullstacks/nuxt-ts/public/frontend-language.svg" ;;
    spring-boot-mvc) echo "$ROOT_DIR/fullstacks/spring-boot-mvc/src/main/resources/static/stack-logos/java.svg" ;;
    *) return 1 ;;
  esac
}

framework_logo_pattern_for() {
  case "$1" in
    react-ts|vue3-ts|angular-ts|svelte-ts|next-ts|nuxt-ts) echo '/frontend\.svg' ;;
    spring-boot-mvc) echo '/stack-logos/spring-boot\.svg' ;;
    *) return 1 ;;
  esac
}

verify_command_for() {
  case "$1" in
    react-ts) echo "npm run build" ;;
    vue3-ts) echo "npm run build" ;;
    angular-ts) echo "CI=1 npx ng build --no-progress" ;;
    svelte-ts) echo "npm run check" ;;
    next-ts) echo "npm run build" ;;
    nuxt-ts) echo "npm run build" ;;
    spring-boot-mvc) echo "./mvnw test" ;;
    *) return 1 ;;
  esac
}

run_static_checks() {
  frontend="$1"
  home_file="$(home_file_for "$frontend")" || return 1
  home_data_file="$(home_data_file_for "$frontend")" || return 1
  logo_file="$(frontend_logo_for "$frontend")" || return 1
  language_logo_file="$(language_logo_for "$frontend")" || return 1
  framework_logo_pattern="$(framework_logo_pattern_for "$frontend")" || return 1

  if [ ! -f "$home_file" ]; then
    echo "  缺少首页文件: $home_file"
    return 1
  fi

  for data_file in $home_data_file; do
    if [ ! -f "$data_file" ]; then
      echo "  缺少首页数据文件: $data_file"
      return 1
    fi
  done

  if [ ! -f "$logo_file" ]; then
    echo "  缺少前端 logo 文件: $logo_file"
    return 1
  fi

  if [ ! -f "$language_logo_file" ]; then
    echo "  缺少语言 logo 文件: $language_logo_file"
    return 1
  fi

  if ! rg -q "$framework_logo_pattern" $home_data_file; then
    echo "  首页未引用本地前端框架 logo: $home_data_file"
    return 1
  fi

  if [ "$frontend" = "spring-boot-mvc" ]; then
    if ! rg -q '/stack-logos/java\.svg' $home_data_file; then
      echo "  首页未引用 Java logo: $home_data_file"
      return 1
    fi
    if ! rg -q '/stack-logos/thymeleaf\.svg' $home_data_file; then
      echo "  首页未引用 Thymeleaf logo: $home_data_file"
      return 1
    fi
    if ! rg -q '/stack-logos/htmx\.svg' $home_data_file; then
      echo "  首页未引用 HTMX logo: $home_data_file"
      return 1
    fi
    if ! rg -q '/stack-logos/sqlite\.svg' $home_data_file; then
      echo "  首页未引用 SQLite logo: $home_data_file"
      return 1
    fi
  elif ! rg -q '/frontend-language\.svg' $home_data_file; then
    echo "  首页未引用前端语言 logo: $home_data_file"
    return 1
  fi

  if [ "$frontend" = "next-ts" ] || [ "$frontend" = "nuxt-ts" ]; then
    if ! rg -q '/sqlite-logo\.svg' $home_data_file; then
      echo "  全栈首页未引用数据库 logo: $home_data_file"
      return 1
    fi
  elif [ "$frontend" != "spring-boot-mvc" ] && ! rg -q 'backend\.svg' $home_data_file; then
    echo "  首页未引用后端框架 logo: $home_data_file"
    return 1
  fi

  if [ "$frontend" != "next-ts" ] && [ "$frontend" != "nuxt-ts" ] && [ "$frontend" != "spring-boot-mvc" ] && ! rg -q 'language\.svg' $home_data_file; then
    echo "  首页未引用后端语言 logo: $home_data_file"
    return 1
  fi

  if [ "$frontend" != "next-ts" ] && [ "$frontend" != "nuxt-ts" ] && [ "$frontend" != "spring-boot-mvc" ] && ! rg -q 'database\.svg' $home_data_file; then
    echo "  首页未引用后端数据库 logo: $home_data_file"
    return 1
  fi

  if ! rg -q 'TECHNOLOGY STACK' "$home_file"; then
    echo "  首页缺少技术栈卡标题: $home_file"
    return 1
  fi

  if ! rg -q '创建胶囊' "$home_file"; then
    echo "  首页缺少创建胶囊入口: $home_file"
    return 1
  fi

  if ! rg -q '开启胶囊' "$home_file"; then
    echo "  首页缺少开启胶囊入口: $home_file"
    return 1
  fi

  if ! rg -q '封存此刻' "$home_file"; then
    echo "  首页缺少新版 Hero 标题: $home_file"
    return 1
  fi

  return 0
}

run_verify_command() {
  frontend="$1"
  workdir="$(dir_for "$frontend")" || return 1
  command="$(verify_command_for "$frontend")" || return 1

  (
    cd "$workdir" &&
    eval "$command"
  )
}

append_summary() {
  frontend="$1"
  static_result="$2"
  command_result="$3"
  overall_result="$4"
  SUMMARY_LINES="${SUMMARY_LINES}${frontend}|${static_result}|${command_result}|${overall_result}
"
}

echo "=== HelloTime 前端通用验证 ==="
echo "验证对象: $SELECTED_FRONTENDS"
echo ""

for frontend in $SELECTED_FRONTENDS; do
  label="$(label_for "$frontend")"

  if [ "$label" = "Unknown" ]; then
    echo "[未知实现] $frontend"
    append_summary "$frontend" "N/A" "N/A" "FAIL"
    FAILED_COUNT=$((FAILED_COUNT + 1))
    continue
  fi

  print_divider
  echo "[$label] 静态约束检查"

  static_result="FAIL"
  if run_static_checks "$frontend"; then
    static_result="PASS"
    echo "  通过"
  fi

  command_result="FAIL"
  command="$(verify_command_for "$frontend")"
  echo "[$label] 执行本地验证命令"
  echo "  命令: $command"
  if run_verify_command "$frontend"; then
    command_result="PASS"
    echo "  通过"
  else
    echo "  失败"
  fi

  overall_result="FAIL"
  if [ "$static_result" = "PASS" ] && [ "$command_result" = "PASS" ]; then
    overall_result="PASS"
  else
    FAILED_COUNT=$((FAILED_COUNT + 1))
  fi

  append_summary "$frontend" "$static_result" "$command_result" "$overall_result"
done

echo ""
print_divider
echo "验证矩阵"
printf "%-12s %-10s %-10s %-10s\n" "实现" "静态检查" "本地命令" "总状态"
printf "%s" "$SUMMARY_LINES" | while IFS='|' read -r frontend static_result command_result overall_result; do
  [ -z "$frontend" ] && continue
  printf "%-12s %-10s %-10s %-10s\n" "$frontend" "$static_result" "$command_result" "$overall_result"
done

echo ""
if [ "$FAILED_COUNT" -gt 0 ]; then
  echo "前端验证失败: $FAILED_COUNT 个实现未通过"
  exit 1
fi

echo "前端验证通过"
