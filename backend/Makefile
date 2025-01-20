CC=g++
CXXFLAGS= -Wall -std=c++11 -Iinclude -Isrc -Isrc/utils -Isrc/handlers
LDFLAGS= -lmysqlclient -lmysqlcppconn -lsodium -lssl -lcrypto

TARGET=restaurant_server

SRC_DIR=src
OBJ_DIR=obj


SRCS=$(wildcard $(SRC_DIR)/*.cc) $(wildcard $(SRC_DIR)/*/*.cc)
OBJS=$(patsubst $(SRC_DIR)/%.cc,$(OBJ_DIR)/%.o,$(SRCS))

$(TARGET): $(OBJS)
	$(CC) -o $@ $^ $(LDFLAGS) 

$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cc
	@mkdir -p $(dir $@)
	$(CC) $(CXXFLAGS) -c -o $@ $<

.PHONY: clean
clean:
	rm -rf $(OBJ_DIR) $(TARGET)