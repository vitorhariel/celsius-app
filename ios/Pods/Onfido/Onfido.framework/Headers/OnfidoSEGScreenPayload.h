#import <Foundation/Foundation.h>
#import "OnfidoSEGPayload.h"

NS_ASSUME_NONNULL_BEGIN


@interface OnfidoSEGScreenPayload : OnfidoSEGPayload

@property (nonatomic, readonly) NSString *name;

@property (nonatomic, readonly, nullable) NSString *category;

@property (nonatomic, readonly, nullable) NSDictionary *properties;

- (instancetype)initWithName:(NSString *)name
                  properties:(NSDictionary *_Nullable)properties
                     context:(NSDictionary *)context
                integrations:(NSDictionary *)integrations;

@end

NS_ASSUME_NONNULL_END
