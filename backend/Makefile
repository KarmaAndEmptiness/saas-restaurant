# 添加依赖检查
# REQUIRED_PACKAGES := libssl-dev libboost-all-dev nlohmann-json-dev
# $(shell apt-get update && apt-get install -y $(REQUIRED_PACKAGES))

CXX := g++
CXXFLAGS := -std=c++17 -Wall -Wextra -Werror -g -I./include -I/usr/local/include
LDFLAGS := -lpthread -lssl -lcrypto -lboost_system

# 目录结构
SRC_DIR := src
BUILD_DIR := build
BIN_DIR := bin
INCLUDE_DIR := include

# 源文件和目标文件
SRCS := $(shell find $(SRC_DIR) -name '*.cpp')
OBJS := $(SRCS:$(SRC_DIR)/%.cpp=$(BUILD_DIR)/%.o)
TARGET := $(BIN_DIR)/server

# 确保目录存在
$(shell mkdir -p $(BUILD_DIR) $(BIN_DIR))

.PHONY: all clean run

all: $(TARGET)

$(TARGET): $(OBJS)
	$(CXX) $(OBJS) -o $@ $(LDFLAGS)

$(BUILD_DIR)/%.o: $(SRC_DIR)/%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -rf $(BUILD_DIR) $(BIN_DIR)

run: $(TARGET)
	./$(TARGET) 