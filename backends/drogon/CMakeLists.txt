cmake_minimum_required(VERSION 3.25)

project(hellotime-drogon LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

include(FetchContent)

set(BUILD_CTL OFF CACHE BOOL "" FORCE)
set(BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
set(BUILD_ORM OFF CACHE BOOL "" FORCE)
set(BUILD_REDIS OFF CACHE BOOL "" FORCE)
set(BUILD_BROTLI OFF CACHE BOOL "" FORCE)
set(BUILD_YAML_CONFIG OFF CACHE BOOL "" FORCE)
set(BUILD_SHARED_LIBS OFF CACHE BOOL "" FORCE)

FetchContent_Declare(
  drogon
  GIT_REPOSITORY https://github.com/drogonframework/drogon.git
  GIT_TAG v1.9.12
)
FetchContent_MakeAvailable(drogon)

find_package(OpenSSL REQUIRED)
find_package(SQLite3 REQUIRED)

# Handle case where FindSQLite3 doesn't create an imported target
if(NOT TARGET SQLite3::SQLite3)
  add_library(SQLite3::SQLite3 UNKNOWN IMPORTED)
  set_target_properties(SQLite3::SQLite3 PROPERTIES
    IMPORTED_LOCATION "${SQLite3_LIBRARIES}"
    INTERFACE_INCLUDE_DIRECTORIES "${SQLite3_INCLUDE_DIRS}"
  )
endif()

add_library(hellotime_drogon_lib
  src/server.cc
)

target_include_directories(hellotime_drogon_lib
  PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/src
)

target_link_libraries(hellotime_drogon_lib
  PUBLIC
    drogon
    OpenSSL::Crypto
    SQLite3::SQLite3
)

add_executable(hellotime-drogon
  src/main.cc
)

target_link_libraries(hellotime-drogon PRIVATE hellotime_drogon_lib)

add_executable(hellotime-drogon-tests
  tests/backend_tests.cc
)

target_link_libraries(hellotime-drogon-tests PRIVATE hellotime_drogon_lib)

enable_testing()
add_test(NAME hellotime-drogon-tests COMMAND hellotime-drogon-tests)
